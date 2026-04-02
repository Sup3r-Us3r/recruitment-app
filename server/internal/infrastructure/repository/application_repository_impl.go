package repository

import (
	"context"
	"errors"
	"time"

	"recruitment/internal/domain/entity"
	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/domain/repository"
	"recruitment/internal/infrastructure/database/model"

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
		ID:         m.ID,
		JobID:      m.JobID,
		UserID:     m.UserID,
		CanceledAt: m.CanceledAt,
		CreatedAt:  m.CreatedAt,
	}

	if m.Job.ID != 0 {
		app.Job = &entity.Job{
			ID:          m.Job.ID,
			Title:       m.Job.Title,
			Description: m.Job.Description,
			Company:     m.Job.Company,
			Location:    m.Job.Location,
			WorkMode:    entity.WorkMode(m.Job.WorkMode),
			Labels:      []string(m.Job.Labels),
			CanceledAt:  m.Job.CanceledAt,
			OwnerID:     m.Job.OwnerID,
			CreatedAt:   m.Job.CreatedAt,
		}
	}

	if m.User.ID != 0 {
		app.User = &entity.User{
			ID:        m.User.ID,
			Name:      m.User.Name,
			Email:     m.User.Email,
			CreatedAt: m.User.CreatedAt,
		}
	}

	return app
}

// Apply creates a new application or reactivates a canceled one.
func (r *applicationRepositoryImpl) Apply(ctx context.Context, application *entity.Application) error {
	var existing model.ApplicationModel
	err := r.db.WithContext(ctx).Unscoped().
		Where("job_id = ? AND user_id = ?", application.JobID, application.UserID).
		First(&existing).Error

	if err == nil {
		// Record exists — check if it's canceled
		if existing.CanceledAt == nil && existing.DeletedAt.Time.IsZero() {
			return domainErrs.ErrDuplicateApplication
		}
		// Reactivate: clear canceled_at and deleted_at
		err = r.db.WithContext(ctx).Unscoped().Model(&existing).Updates(map[string]interface{}{
			"canceled_at": nil,
			"deleted_at":  nil,
			"updated_at":  time.Now(),
		}).Error
		if err != nil {
			return err
		}
		application.ID = existing.ID
		application.CreatedAt = existing.CreatedAt
		return nil
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	// No existing record — create new
	m := &model.ApplicationModel{
		JobID:  application.JobID,
		UserID: application.UserID,
	}
	if err := r.db.WithContext(ctx).Create(m).Error; err != nil {
		return err
	}
	application.ID = m.ID
	application.CreatedAt = m.CreatedAt
	return nil
}

// Cancel sets canceled_at on an active application.
func (r *applicationRepositoryImpl) Cancel(ctx context.Context, jobID, userID uint) error {
	now := time.Now()
	result := r.db.WithContext(ctx).
		Model(&model.ApplicationModel{}).
		Where("job_id = ? AND user_id = ? AND canceled_at IS NULL", jobID, userID).
		Update("canceled_at", now)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return domainErrs.ErrApplicationNotFound
	}
	return nil
}

// CancelAllByJobID cancels all active applications for a given job.
func (r *applicationRepositoryImpl) CancelAllByJobID(ctx context.Context, jobID uint) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&model.ApplicationModel{}).
		Where("job_id = ? AND canceled_at IS NULL", jobID).
		Update("canceled_at", now).Error
}

// ListByUserID returns all applications for a user (including canceled).
func (r *applicationRepositoryImpl) ListByUserID(ctx context.Context, userID uint) ([]entity.Application, error) {
	var models []model.ApplicationModel
	err := r.db.WithContext(ctx).
		Preload("Job").Preload("User").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&models).Error
	if err != nil {
		return nil, err
	}

	var apps []entity.Application
	for _, m := range models {
		apps = append(apps, toApplicationEntity(m))
	}
	return apps, nil
}

// ListByJobID returns all active applications for a job with user data.
func (r *applicationRepositoryImpl) ListByJobID(ctx context.Context, jobID uint) ([]entity.Application, error) {
	var models []model.ApplicationModel
	err := r.db.WithContext(ctx).
		Preload("User").
		Where("job_id = ? AND canceled_at IS NULL", jobID).
		Order("created_at desc").
		Find(&models).Error
	if err != nil {
		return nil, err
	}

	var apps []entity.Application
	for _, m := range models {
		apps = append(apps, toApplicationEntity(m))
	}
	return apps, nil
}

// Exists checks if an active application exists.
func (r *applicationRepositoryImpl) Exists(ctx context.Context, jobID, userID uint) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&model.ApplicationModel{}).
		Where("job_id = ? AND user_id = ? AND canceled_at IS NULL", jobID, userID).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// CountByJobID counts only active applications.
func (r *applicationRepositoryImpl) CountByJobID(ctx context.Context, jobID uint) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&model.ApplicationModel{}).
		Where("job_id = ? AND canceled_at IS NULL", jobID).
		Count(&count).Error
	return count, err
}
