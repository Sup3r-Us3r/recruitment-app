package entity

import "time"

type Application struct {
	ID        uint
	JobID     uint
	UserID    uint
	CreatedAt time.Time
}
