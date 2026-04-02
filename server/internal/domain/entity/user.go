package entity

import "time"

type UserRole string

const (
	RoleCandidate UserRole = "candidate"
	RoleRecruiter UserRole = "recruiter"
)

type User struct {
	ID           uint
	Name         string
	Email        string
	PasswordHash string
	Role         UserRole
	CreatedAt    time.Time
}
