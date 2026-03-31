package model

import "gorm.io/gorm"

type UserModel struct {
	gorm.Model
	Email        string             `gorm:"uniqueIndex;not null"`
	PasswordHash string             `gorm:"not null"`
	Jobs         []JobModel         `gorm:"foreignKey:OwnerID"`
	Applications []ApplicationModel `gorm:"foreignKey:UserID"`
}
