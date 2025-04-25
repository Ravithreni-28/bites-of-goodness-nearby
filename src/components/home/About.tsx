
import { Separator } from "@/components/ui/separator";

export const About = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">About Zero Waste Bites</h2>
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <p className="mb-4 text-gray-700">
            Zero Waste Bites is a food rescue and redistribution platform that addresses food waste by connecting individuals who have overcooked or excess food with nearby consumers looking for affordable meal options.
          </p>
          <p className="mb-6 text-gray-700">
            Our mission is to reduce food waste while providing affordable meal options and building community connections. By sharing your excess food, you're not only helping someone enjoy a delicious meal but also contributing to a more sustainable future.
          </p>
          <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Our Objectives:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Reduce food waste in communities",
              "Provide affordable meal options",
              "Foster community connections",
              "Create a sustainable food ecosystem",
              "Promote resourcefulness",
              "Support local food sharing"
            ].map((item, index) => (
              <li key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mr-3"></div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
