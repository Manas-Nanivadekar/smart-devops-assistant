import boto3
from botocore.exceptions import ClientError


class ResourceFetcher:
    def __init__(self, service_name, region_name):
        self.client = boto3.client(service_name, region_name=region_name)

    def fetch_resources(self):
        try:
            # Example for EC2 instances
            response = self.client.describe_instances()
            return response["Reservations"]
        except ClientError as e:
            print(f"Error fetching resources: {e}")
            return None

    def generate_demo_metadata(self):
        return [
            {
                "InstanceId": "i-1234567890abcdef0",
                "InstanceType": "t2.micro",
                "State": {"Name": "running"},
                "PublicIpAddress": "198.51.100.1",
                "Tags": [{"Key": "Name", "Value": "DemoInstance"}],
            }
        ]
