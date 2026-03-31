package repository

import (
	"context"
	"errors"

	"recruitment/internal/domain/entity"
	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/domain/repository"
	"recruitment/internal/infrastructure/database/model"

	"github.com/jackc/pgx/v5/pgconn"
	"gorm.io/gorm"
)

type userRepositoryImpl struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) repository.UserRepository {
	return &userRepositoryImpl{db: db}
}

func toUserEntity(m model.UserModel) *entity.User {
	return &entity.User{
		ID:           m.ID,
		Email:        m.Email,
		PasswordHash: m.PasswordHash,
		CreatedAt:    m.CreatedAt,
	}
}

func toUserModel(e *entity.User) *model.UserModel {
	m := &model.UserModel{
		Email:        e.Email,
		PasswordHash: e.PasswordHash,
	}
	m.ID = e.ID
	m.CreatedAt = e.CreatedAt
	return m
}

func (r *userRepositoryImpl) Create(ctx context.Context, user *entity.User) error {
	m := toUserModel(user)
	err := r.db.WithContext(ctx).Create(m).Error
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" { // unique violation
			return domainErrs.ErrEmailAlreadyExists
		}
		return err
	}
	user.ID = m.ID
	user.CreatedAt = m.CreatedAt
	return nil
}

func (r *userRepositoryImpl) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	var m model.UserModel
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&m).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domainErrs.ErrInvalidCredentials
		}
		return nil, err
	}
	return toUserEntity(m), nil
}

func (r *userRepositoryImpl) FindByID(ctx context.Context, id uint) (*entity.User, error) {
	var m model.UserModel
	err := r.db.WithContext(ctx).First(&m, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // Or a specific ErrUserNotFound
		}
		return nil, err
	}
	return toUserEntity(m), nil
}
