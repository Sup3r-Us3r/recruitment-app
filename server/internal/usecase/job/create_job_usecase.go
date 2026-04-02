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
	Title       string   `json:"title" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Company     string   `json:"company"`
	Location    string   `json:"location"`
	WorkMode    string   `json:"work_mode" binding:"required,oneof=on_site remote hybrid"`
	Labels      []string `json:"labels"`
	OwnerID     uint     `json:"-"`
}

func (uc *CreateJobUseCase) Execute(ctx context.Context, input CreateJobInput) (*entity.Job, error) {
	labels := input.Labels
	if labels == nil {
		labels = []string{}
	}

	job := &entity.Job{
		Title:       input.Title,
		Description: input.Description,
		Company:     input.Company,
		Location:    input.Location,
		WorkMode:    entity.WorkMode(input.WorkMode),
		Labels:      labels,
		OwnerID:     input.OwnerID,
	}

	err := uc.jobRepo.Create(ctx, job)
	if err != nil {
		return nil, err
	}

	return job, nil
}
