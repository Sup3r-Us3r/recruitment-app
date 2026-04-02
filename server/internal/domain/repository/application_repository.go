package repository

import (
	"context"

	"recruitment/internal/domain/entity"
)

type ApplicationRepository interface {
	Apply(ctx context.Context, application *entity.Application) error
	Cancel(ctx context.Context, jobID, userID uint) error
	CancelAllByJobID(ctx context.Context, jobID uint) error
	ListByUserID(ctx context.Context, userID uint) ([]entity.Application, error)
	ListByJobID(ctx context.Context, jobID uint) ([]entity.Application, error)
	Exists(ctx context.Context, jobID, userID uint) (bool, error)
	CountByJobID(ctx context.Context, jobID uint) (int64, error)
}
