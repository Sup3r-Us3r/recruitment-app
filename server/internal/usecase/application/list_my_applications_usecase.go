package application

import (
	"context"

	"recruitment/internal/domain/entity"
	"recruitment/internal/domain/repository"
)

type ListMyApplicationsUseCase struct {
	appRepo repository.ApplicationRepository
}

func NewListMyApplicationsUseCase(repo repository.ApplicationRepository) *ListMyApplicationsUseCase {
	return &ListMyApplicationsUseCase{appRepo: repo}
}

func (uc *ListMyApplicationsUseCase) Execute(ctx context.Context, userID uint) ([]entity.Application, error) {
	return uc.appRepo.ListByUserID(ctx, userID)
}
