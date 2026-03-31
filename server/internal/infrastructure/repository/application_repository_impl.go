package repository

import (
	"context"
	"errors"

	"recruitment/internal/domain/entity"
	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/domain/repository"
	"recruitment/internal/infrastructure/database/model"

	"github.com/jackc/pgx/v5/pgconn"
	"gorm.io/gorm"
)

type applicationRepositoryImpl struct {
	db *gorm.DB
}

func NewApplicationRepository(db *gorm.DB) repository.ApplicationRepository {
	return &applicationRepositoryImpl{db: db}
}

func toApplicationEntity(m model.ApplicationModel) entity.Application {
	app := entity.Application{
		ID:        m.ID,
		JobID:     m.JobID,
		UserID:    m.UserID,
		CreatedAt: m.CreatedAt,
	}

	if m.Job.ID != 0 {
		app.Job = &entity.Job{
			ID:          m.Job.ID,
			Title:       m.Job.Title,
			Description: m.Job.Description,
			Location:    m.Job.Location,
			OwnerID:     m.Job.OwnerID,
			CreatedAt:   m.Job.CreatedAt,
		}
	}

	if m.User.ID != 0 {
		app.User = &entity.User{
			ID:        m.User.ID,
			Email:     m.User.Email,
			CreatedAt: m.User.CreatedAt,
		}
	}

	return app
}

func toApplicationModel(e *entity.Application) *model.ApplicationModel {
	m := &model.ApplicationModel{
		JobID:  e.JobID,
		UserID: e.UserID,
	}
	m.ID = e.ID
	m.CreatedAt = e.CreatedAt
	return m
}

func (r *applicationRepositoryImpl) Apply(ctx context.Context, application *entity.Application) error {
	m := toApplicationModel(application)
	err := r.db.WithContext(ctx).Create(m).Error
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" { // unique violation on idx_job_user
			return domainErrs.ErrDuplicateApplication
		}
		return err
	}
	application.ID = m.ID
	application.CreatedAt = m.CreatedAt
	return nil
}

func (r *applicationRepositoryImpl) ListByUserID(ctx context.Context, userID uint) ([]entity.Application, error) {
	var models []model.ApplicationModel
	if err := r.db.WithContext(ctx).Preload("Job").Preload("User").Where("user_id = ?", userID).Order("created_at desc").Find(&models).Error; err != nil {
		return nil, err
	}

	var apps []entity.Application
	for _, m := range models {
		apps = append(apps, toApplicationEntity(m))
	}
	return apps, nil
}

func (r *applicationRepositoryImpl) Exists(ctx context.Context, jobID, userID uint) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.ApplicationModel{}).Where("job_id = ? AND user_id = ?", jobID, userID).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
