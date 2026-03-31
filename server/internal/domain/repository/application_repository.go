package repository

import (
	"context"

	"recruitment/internal/domain/entity"
)

type ApplicationRepository interface {
	Apply(ctx context.Context, application *entity.Application) error
	ListByUserID(ctx context.Context, userID uint) ([]entity.Application, error)
	Exists(ctx context.Context, jobID, userID uint) (bool, error)
}
