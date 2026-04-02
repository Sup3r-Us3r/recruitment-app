package job

import (
	"context"

	"recruitment/internal/domain/entity"
	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/domain/repository"
)

type ListApplicantsUseCase struct {
	jobRepo repository.JobRepository
	appRepo repository.ApplicationRepository
}

func NewListApplicantsUseCase(jobRepo repository.JobRepository, appRepo repository.ApplicationRepository) *ListApplicantsUseCase {
	return &ListApplicantsUseCase{jobRepo: jobRepo, appRepo: appRepo}
}

func (uc *ListApplicantsUseCase) Execute(ctx context.Context, jobID, ownerID uint) ([]entity.Application, error) {
	j, err := uc.jobRepo.FindByID(ctx, jobID)
	if err != nil {
		return nil, err
	}

	if j.OwnerID != ownerID {
		return nil, domainErrs.ErrForbidden
	}

	return uc.appRepo.ListByJobID(ctx, jobID)
}
