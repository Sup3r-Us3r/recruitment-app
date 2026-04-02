package application

import (
	"context"

	"recruitment/internal/domain/repository"
)

type WithdrawUseCase struct {
	appRepo repository.ApplicationRepository
}

func NewWithdrawUseCase(appRepo repository.ApplicationRepository) *WithdrawUseCase {
	return &WithdrawUseCase{appRepo: appRepo}
}

func (uc *WithdrawUseCase) Execute(ctx context.Context, jobID, userID uint) error {
	return uc.appRepo.Cancel(ctx, jobID, userID)
}
