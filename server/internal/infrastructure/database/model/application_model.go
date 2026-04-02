package model

import (
	"time"

	"gorm.io/gorm"
)

type ApplicationModel struct {
	gorm.Model
	JobID      uint       `gorm:"not null;index;uniqueIndex:idx_job_user"`
	UserID     uint       `gorm:"not null;index;uniqueIndex:idx_job_user"`
	CanceledAt *time.Time `gorm:"index"`
	Job        JobModel   `gorm:"foreignKey:JobID"`
	User       UserModel  `gorm:"foreignKey:UserID"`
}
