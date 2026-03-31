package job

import (
	"context"

	"recruitment/internal/domain/entity"
	"recruitment/internal/domain/repository"
)

type ListJobsUseCase struct {
	jobRepo repository.JobRepository
}

func NewListJobsUseCase(repo repository.JobRepository) *ListJobsUseCase {
	return &ListJobsUseCase{jobRepo: repo}
}

func (uc *ListJobsUseCase) Execute(ctx context.Context, ownerID uint) ([]entity.Job, error) {
	return uc.jobRepo.ListByOwnerID(ctx, ownerID)
}
