package cmd

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"
)

const authFile = ".majsAuth"

func isAuthenticatedUser() bool {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return false
	}

	authFilePath := filepath.Join(homeDir, authFile)

	if _, err := os.Stat(authFilePath); os.IsNotExist(err) {
		return false
	}

	return true
}

func setAuthenticatedUser(apiKey string) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("error getting home directory: %w", err)
	}

	authFilePath := filepath.Join(homeDir, authFile)

	data := []byte(apiKey)
	err = os.WriteFile(authFilePath, data, 0600)
	if err != nil {
		return fmt.Errorf("error writing auth file: %w", err)
	}

	fmt.Printf("Auth file created at: %s\n", authFilePath)

	return nil
}

var majsConfigCmd = &cobra.Command{
	Use:   "configure",
	Short: "Authenticate the user",
	Long:  `config`,
	Run: func(cmd *cobra.Command, args []string) {
		// fmt.Println("majsConfig called")
		authenticated, apiKey, err := authenticateUser()
		if err != nil {
			fmt.Println("Error authenticating user:", err)
			return
		}
		if authenticated {
			if err := setAuthenticatedUser(apiKey); err != nil {
				fmt.Println("Error setting authenticated user:", err)
				return
			}
			fmt.Println("Authentication successful. You can now use other commands.")
		} else {
			fmt.Println("Authentication failed. Please try again.")
		}
	},
}

func authenticateUser() (bool, string, error) {
	fmt.Println("Enter your API key:")
	reader := bufio.NewReader(os.Stdin)
	apiKey, err := reader.ReadString('\n')
	if err != nil {
		return false, "", fmt.Errorf("error reading API key: %w", err)
	}

	apiKey = strings.TrimSpace(apiKey)

	url := "https://rgoaes1ar0.execute-api.ap-south-1.amazonaws.com/authenticate"

	// fmt.Println("URL:", url)

	payload := map[string]string{"accessKey": apiKey}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return false, "", fmt.Errorf("error creating JSON payload: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return false, "", fmt.Errorf("error creating HTTP request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return false, "", fmt.Errorf("error making HTTP request: %w", err)
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, "", fmt.Errorf("error decoding response: %w", err)
	}

	if success, ok := result["success"].(bool); ok && success {
		return true, apiKey, nil
	}

	return false, "", nil
}
