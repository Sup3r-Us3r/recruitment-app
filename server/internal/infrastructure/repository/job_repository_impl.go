package repository

import (
	"context"
	"errors"

	"recruitment/internal/domain/entity"
	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/domain/repository"
	"recruitment/internal/infrastructure/database/model"

	"gorm.io/gorm"
)

type jobRepositoryImpl struct {
	db *gorm.DB
}

func NewJobRepository(db *gorm.DB) repository.JobRepository {
	return &jobRepositoryImpl{db: db}
}

func toJobEntity(m model.JobModel) entity.Job {
	return entity.Job{
		ID:          m.ID,
		Title:       m.Title,
		Description: m.Description,
		Location:    m.Location,
		OwnerID:     m.OwnerID,
		CreatedAt:   m.CreatedAt,
	}
}

func toJobModel(e *entity.Job) *model.JobModel {
	m := &model.JobModel{
		Title:       e.Title,
		Description: e.Description,
		Location:    e.Location,
		OwnerID:     e.OwnerID,
	}
	m.ID = e.ID
	m.CreatedAt = e.CreatedAt
	return m
}

func (r *jobRepositoryImpl) Create(ctx context.Context, job *entity.Job) error {
	m := toJobModel(job)
	if err := r.db.WithContext(ctx).Create(m).Error; err != nil {
		return err
	}
	job.ID = m.ID
	job.CreatedAt = m.CreatedAt
	return nil
}

func (r *jobRepositoryImpl) FindByID(ctx context.Context, id uint) (*entity.Job, error) {
	var m model.JobModel
	if err := r.db.WithContext(ctx).First(&m, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domainErrs.ErrJobNotFound
		}
		return nil, err
	}
	ent := toJobEntity(m)
	return &ent, nil
}

func (r *jobRepositoryImpl) ListAll(ctx context.Context, search string) ([]entity.Job, error) {
	var models []model.JobModel
	query := r.db.WithContext(ctx).Order("created_at desc")

	if search != "" {
		likeSearch := "%" + search + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", likeSearch, likeSearch)
	}

	if err := query.Find(&models).Error; err != nil {
		return nil, err
	}

	var jobs []entity.Job
	for _, m := range models {
		jobs = append(jobs, toJobEntity(m))
	}
	return jobs, nil
}

func (r *jobRepositoryImpl) ListByOwnerID(ctx context.Context, ownerID uint) ([]entity.Job, error) {
	var models []model.JobModel
	if err := r.db.WithContext(ctx).Where("owner_id = ?", ownerID).Order("created_at desc").Find(&models).Error; err != nil {
		return nil, err
	}

	var jobs []entity.Job
	for _, m := range models {
		jobs = append(jobs, toJobEntity(m))
	}
	return jobs, nil
}
