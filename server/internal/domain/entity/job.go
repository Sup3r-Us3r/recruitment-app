package entity

import "time"

type Job struct {
	ID          uint
	Title       string
	Description string
	Location    string
	OwnerID     uint
	CreatedAt   time.Time
}
