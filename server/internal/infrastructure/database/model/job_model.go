package model

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"gorm.io/gorm"
)

// StringArray is a custom type for storing []string as JSON in PostgreSQL.
type StringArray []string

func (a StringArray) Value() (driver.Value, error) {
	if a == nil {
		return "[]", nil
	}
	return json.Marshal(a)
}

func (a *StringArray) Scan(value interface{}) error {
	if value == nil {
		*a = StringArray{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("failed to scan StringArray: %v", value)
	}
	return json.Unmarshal(bytes, a)
}

type JobModel struct {
	gorm.Model
	Title        string             `gorm:"not null"`
	Description  string             `gorm:"not null"`
	Company      string
	Location     string
	WorkMode     string             `gorm:"not null;default:'on_site'"`
	Labels       StringArray        `gorm:"type:jsonb;default:'[]'"`
	CanceledAt   *time.Time         `gorm:"index"`
	OwnerID      uint               `gorm:"not null;index"`
	Owner        UserModel          `gorm:"foreignKey:OwnerID"`
	Applications []ApplicationModel `gorm:"foreignKey:JobID"`
}
