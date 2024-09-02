import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Personalized Support",
    description:
      "Expert assistance to guide you through every deployment step.",
    icon: <ChartIcon />,
  },
  {
    title: "Flexible Deployment Options",
    description:
      "Choose between UI or CLI for a deployment method that suits you.",
    icon: <WalletIcon />,
  },
  {
    title: "Secure and Reliable",
    description:
      "Ensure your deployments are safe with robust security and backup solutions.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            At Majs, we prioritize client satisfaction with tailored services
            for seamless deployment.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* <img
          src={image}
          width={100}
          height={100}
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="About services"
        /> */}
        <div className="border-primary border-4 rounded-xl relative mx-auto max-w-md">
          <div className="bg-black text-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
              <div className="flex space-x-1">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xs md:text-sm text-gray-400">bash</div>
            </div>
            <div className="p-4 font-mono text-left">
              <p className="text-green-400">$ majs install</p>
              <p className="text-white">+ majs@1.0.0</p>
              <p className="text-white">
                added 1 package, and audited 2 packages in 3s
              </p>
              <p className="text-green-400 mt-2">$</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
