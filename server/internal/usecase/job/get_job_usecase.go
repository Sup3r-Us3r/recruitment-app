package job

import (
	"context"

	"recruitment/internal/domain/entity"
	"recruitment/internal/domain/repository"
)

type GetJobUseCase struct {
	jobRepo repository.JobRepository
	appRepo repository.ApplicationRepository
}

func NewGetJobUseCase(jobRepo repository.JobRepository, appRepo repository.ApplicationRepository) *GetJobUseCase {
	return &GetJobUseCase{jobRepo: jobRepo, appRepo: appRepo}
}

type GetJobOutput struct {
	Job              *entity.Job
	ApplicationCount int64
}

func (uc *GetJobUseCase) Execute(ctx context.Context, id uint) (*GetJobOutput, error) {
	j, err := uc.jobRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	count, err := uc.appRepo.CountByJobID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &GetJobOutput{
		Job:              j,
		ApplicationCount: count,
	}, nil
}
