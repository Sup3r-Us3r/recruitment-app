package job

import (
	"context"

	"recruitment/internal/domain/entity"
	"recruitment/internal/domain/repository"
)

type SearchJobsUseCase struct {
	jobRepo repository.JobRepository
}

func NewSearchJobsUseCase(repo repository.JobRepository) *SearchJobsUseCase {
	return &SearchJobsUseCase{jobRepo: repo}
}

func (uc *SearchJobsUseCase) Execute(ctx context.Context, filter repository.JobFilter) ([]entity.Job, error) {
	return uc.jobRepo.ListAll(ctx, filter)
}
