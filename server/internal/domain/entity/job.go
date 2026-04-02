package entity

import "time"

type WorkMode string

const (
	WorkModeOnSite WorkMode = "on_site"
	WorkModeRemote WorkMode = "remote"
	WorkModeHybrid WorkMode = "hybrid"
)

type Job struct {
	ID          uint
	Title       string
	Description string
	Company     string
	Location    string
	WorkMode    WorkMode
	Labels      []string
	OwnerID     uint
	CanceledAt  *time.Time
	CreatedAt   time.Time
}
