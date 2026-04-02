package job

import (
	"context"

	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/domain/repository"
)

type CancelJobUseCase struct {
	jobRepo repository.JobRepository
	appRepo repository.ApplicationRepository
}

func NewCancelJobUseCase(jobRepo repository.JobRepository, appRepo repository.ApplicationRepository) *CancelJobUseCase {
	return &CancelJobUseCase{jobRepo: jobRepo, appRepo: appRepo}
}

func (uc *CancelJobUseCase) Execute(ctx context.Context, jobID, ownerID uint) error {
	existing, err := uc.jobRepo.FindByID(ctx, jobID)
	if err != nil {
		return err
	}

	if existing.OwnerID != ownerID {
		return domainErrs.ErrForbidden
	}

	// Cancel all active applications for this job
	if err := uc.appRepo.CancelAllByJobID(ctx, jobID); err != nil {
		return err
	}

	return uc.jobRepo.Cancel(ctx, jobID)
}
