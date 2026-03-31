package job

import (
	"context"

	"recruitment/internal/domain/entity"
	"recruitment/internal/domain/repository"
)

type CreateJobUseCase struct {
	jobRepo repository.JobRepository
}

func NewCreateJobUseCase(repo repository.JobRepository) *CreateJobUseCase {
	return &CreateJobUseCase{jobRepo: repo}
}

type CreateJobInput struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Location    string `json:"location"`
	OwnerID     uint   `json:"-"`
}

func (uc *CreateJobUseCase) Execute(ctx context.Context, input CreateJobInput) (*entity.Job, error) {
	job := &entity.Job{
		Title:       input.Title,
		Description: input.Description,
		Location:    input.Location,
		OwnerID:     input.OwnerID,
	}

	err := uc.jobRepo.Create(ctx, job)
	if err != nil {
		return nil, err
	}

	return job, nil
}
