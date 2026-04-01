package model

import "gorm.io/gorm"

type UserModel struct {
	gorm.Model
	Email        string             `gorm:"uniqueIndex;not null"`
	PasswordHash string             `gorm:"not null"`
	Role         string             `gorm:"type:varchar(20);not null;default:'candidate'"`
	Jobs         []JobModel         `gorm:"foreignKey:OwnerID"`
	Applications []ApplicationModel `gorm:"foreignKey:UserID"`
}
