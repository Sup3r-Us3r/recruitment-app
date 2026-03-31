package model

import "gorm.io/gorm"

type ApplicationModel struct {
	gorm.Model
	JobID  uint      `gorm:"not null;index;uniqueIndex:idx_job_user"`
	UserID uint      `gorm:"not null;index;uniqueIndex:idx_job_user"`
	Job    JobModel  `gorm:"foreignKey:JobID"`
	User   UserModel `gorm:"foreignKey:UserID"`
}
