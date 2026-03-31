package model

import "gorm.io/gorm"

type JobModel struct {
	gorm.Model
	Title        string             `gorm:"not null"`
	Description  string             `gorm:"not null"`
	Location     string
	OwnerID      uint               `gorm:"not null;index"`
	Owner        UserModel          `gorm:"foreignKey:OwnerID"`
	Applications []ApplicationModel `gorm:"foreignKey:JobID"`
}
