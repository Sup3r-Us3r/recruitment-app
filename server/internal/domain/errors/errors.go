package errors

import "errors"

var (
	ErrEmailAlreadyExists   = errors.New("email already exists")
	ErrInvalidCredentials   = errors.New("invalid credentials")
	ErrInvalidRole          = errors.New("invalid role")
	ErrForbidden            = errors.New("forbidden")
	ErrJobNotFound          = errors.New("job not found")
	ErrDuplicateApplication = errors.New("already applied to this job")
	ErrCannotApplyOwnJob    = errors.New("cannot apply to your own job")
	ErrApplicationNotFound  = errors.New("application not found")
)
