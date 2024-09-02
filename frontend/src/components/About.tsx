import { Statistics } from "./Statistics";
// import pilot from "../assets/pilot.png";
import image from "/image1.jpg";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-background border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={image}
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Majs
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Majs is a platform that simplifies application deployment across
                multiple cloud providers. It allows you to deploy your
                applications with a single click, without having to worry about
                the underlying infrastructure. With features like automated
                dependency management and customizable deployment flows, Majs
                streamlines the entire process, catering to both beginners and
                experienced developers!
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
