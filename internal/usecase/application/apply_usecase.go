package application

import (
	"context"

	"recruitment/internal/domain/entity"
	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/domain/repository"
)

type ApplyUseCase struct {
	appRepo repository.ApplicationRepository
	jobRepo repository.JobRepository
}

func NewApplyUseCase(appRepo repository.ApplicationRepository, jobRepo repository.JobRepository) *ApplyUseCase {
	return &ApplyUseCase{
		appRepo: appRepo,
		jobRepo: jobRepo,
	}
}

func (uc *ApplyUseCase) Execute(ctx context.Context, jobID, userID uint) (*entity.Application, error) {
	job, err := uc.jobRepo.FindByID(ctx, jobID)
	if err != nil {
		return nil, err
	}

	if job.OwnerID == userID {
		return nil, domainErrs.ErrCannotApplyOwnJob
	}

	app := &entity.Application{
		JobID:  jobID,
		UserID: userID,
	}

	err = uc.appRepo.Apply(ctx, app)
	if err != nil {
		return nil, err
	}

	return app, nil
}
