import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import image from "/vite.svg";
import web from "/ui.png";
import cli from "/cli.png";
import james from "/james.png";

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "Deploy with Ease via Web Interface",
    description:
      "Deploy your app without needing to write complex scripts or understand cloud infrastructure. No scripts, no hassle.",
    image: web,
  },
  {
    title: "Powerful CLI Deployment",
    description:
      "Use the CLI to deploy your app with a single command. Automate your deployment process and integrate with your CI/CD pipeline.",
    image: cli,
  },
  {
    title: "James: Your AI DevOps Engineer",
    description:
      "James your AI powered Devops Assistant helps you with troubleshooting or optimizing deployments, and provides instant guidance and support, making your DevOps journey smoother. ",
    image: james,
  },
];

const featureList: string[] = [
  "Lorem ipsum",
  "Lorem ipsum",
  "Lorem ipsum",
  "Lorem ipsum",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Many{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <img
                src={image}
                alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
