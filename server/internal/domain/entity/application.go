package entity

import "time"

type Application struct {
	ID        uint
	JobID     uint
	UserID    uint
	Job       *Job
	User      *User
	CreatedAt time.Time
}
