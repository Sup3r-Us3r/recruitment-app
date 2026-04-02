package repository

import (
	"context"

	"recruitment/internal/domain/entity"
)

type JobFilter struct {
	Search    string
	WorkModes []string
	Labels    []string
}

type JobRepository interface {
	Create(ctx context.Context, job *entity.Job) error
	Update(ctx context.Context, job *entity.Job) error
	Cancel(ctx context.Context, id uint) error
	FindByID(ctx context.Context, id uint) (*entity.Job, error)
	ListAll(ctx context.Context, filter JobFilter) ([]entity.Job, error)
	ListByOwnerID(ctx context.Context, ownerID uint) ([]entity.Job, error)
	ListDistinctLabels(ctx context.Context) ([]string, error)
}
