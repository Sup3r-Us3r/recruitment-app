package repository

import (
	"context"

	"recruitment/internal/domain/entity"
)

type JobRepository interface {
	Create(ctx context.Context, job *entity.Job) error
	FindByID(ctx context.Context, id uint) (*entity.Job, error)
	ListAll(ctx context.Context, search string) ([]entity.Job, error)
	ListByOwnerID(ctx context.Context, ownerID uint) ([]entity.Job, error)
}
