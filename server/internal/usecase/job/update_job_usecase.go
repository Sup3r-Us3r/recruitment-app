package job

import (
	"context"

	"recruitment/internal/domain/entity"
	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/domain/repository"
)

type UpdateJobUseCase struct {
	jobRepo repository.JobRepository
}

func NewUpdateJobUseCase(repo repository.JobRepository) *UpdateJobUseCase {
	return &UpdateJobUseCase{jobRepo: repo}
}

type UpdateJobInput struct {
	ID          uint     `json:"-"`
	Title       string   `json:"title" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Company     string   `json:"company"`
	Location    string   `json:"location"`
	WorkMode    string   `json:"work_mode" binding:"required,oneof=on_site remote hybrid"`
	Labels      []string `json:"labels"`
	OwnerID     uint     `json:"-"`
}

func (uc *UpdateJobUseCase) Execute(ctx context.Context, input UpdateJobInput) (*entity.Job, error) {
	existing, err := uc.jobRepo.FindByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	if existing.OwnerID != input.OwnerID {
		return nil, domainErrs.ErrForbidden
	}

	labels := input.Labels
	if labels == nil {
		labels = []string{}
	}

	existing.Title = input.Title
	existing.Description = input.Description
	existing.Company = input.Company
	existing.Location = input.Location
	existing.WorkMode = entity.WorkMode(input.WorkMode)
	existing.Labels = labels

	if err := uc.jobRepo.Update(ctx, existing); err != nil {
		return nil, err
	}

	return existing, nil
}
