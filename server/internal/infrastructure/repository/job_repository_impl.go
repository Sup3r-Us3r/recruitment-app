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

type jobRepositoryImpl struct {
	db *gorm.DB
}

func NewJobRepository(db *gorm.DB) repository.JobRepository {
	return &jobRepositoryImpl{db: db}
}

func normalizeWorkMode(wm string) entity.WorkMode {
	if wm == "" {
		return entity.WorkModeOnSite
	}
	return entity.WorkMode(wm)
}

func toJobEntity(m model.JobModel) entity.Job {
	labels := make([]string, len(m.Labels))
	copy(labels, m.Labels)
	return entity.Job{
		ID:          m.ID,
		Title:       m.Title,
		Description: m.Description,
		Company:     m.Company,
		Location:    m.Location,
		WorkMode:    normalizeWorkMode(m.WorkMode),
		Labels:      labels,
		CanceledAt:  m.CanceledAt,
		OwnerID:     m.OwnerID,
		CreatedAt:   m.CreatedAt,
	}
}

func toJobModel(e *entity.Job) *model.JobModel {
	labels := make(model.StringArray, len(e.Labels))
	copy(labels, e.Labels)
	m := &model.JobModel{
		Title:       e.Title,
		Description: e.Description,
		Company:     e.Company,
		Location:    e.Location,
		WorkMode:    string(e.WorkMode),
		Labels:      labels,
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

func (r *jobRepositoryImpl) Update(ctx context.Context, job *entity.Job) error {
	m := toJobModel(job)
	result := r.db.WithContext(ctx).Model(m).Updates(map[string]interface{}{
		"title":       m.Title,
		"description": m.Description,
		"company":     m.Company,
		"location":    m.Location,
		"work_mode":   m.WorkMode,
		"labels":      m.Labels,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return domainErrs.ErrJobNotFound
	}
	return nil
}

func (r *jobRepositoryImpl) Cancel(ctx context.Context, id uint) error {
	now := time.Now()
	result := r.db.WithContext(ctx).
		Model(&model.JobModel{}).
		Where("id = ? AND canceled_at IS NULL", id).
		Update("canceled_at", now)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return domainErrs.ErrJobNotFound
	}
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

func (r *jobRepositoryImpl) ListAll(ctx context.Context, filter repository.JobFilter) ([]entity.Job, error) {
	var models []model.JobModel
	query := r.db.WithContext(ctx).Order("created_at desc")

	if filter.Search != "" {
		likeSearch := "%" + filter.Search + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", likeSearch, likeSearch)
	}

	if len(filter.WorkModes) > 0 {
		// Treat empty/null work_mode as 'on_site' for jobs created before the field existed
		hasOnSite := false
		for _, m := range filter.WorkModes {
			if m == "on_site" {
				hasOnSite = true
				break
			}
		}
		if hasOnSite {
			query = query.Where("(COALESCE(NULLIF(work_mode, ''), 'on_site') IN ?)", filter.WorkModes)
		} else {
			query = query.Where("work_mode IN ?", filter.WorkModes)
		}
	}

	if len(filter.Labels) > 0 {
		for _, label := range filter.Labels {
			query = query.Where("labels @> ?", `["`+label+`"]`)
		}
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

func (r *jobRepositoryImpl) ListDistinctLabels(ctx context.Context) ([]string, error) {
	var results []string
	err := r.db.WithContext(ctx).
		Raw("SELECT DISTINCT jsonb_array_elements_text(labels) AS label FROM job_models WHERE jsonb_array_length(COALESCE(labels, '[]'::jsonb)) > 0 ORDER BY label").
		Scan(&results).Error
	if err != nil {
		return nil, err
	}
	return results, nil
}
