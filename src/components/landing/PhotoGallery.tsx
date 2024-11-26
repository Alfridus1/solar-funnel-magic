import { motion } from "framer-motion";

export const PhotoGallery = () => {
  const photos = [
    {
      url: "/lovable-uploads/7522a791-776e-477a-9b45-a30e09c748cf.png",
      title: "Klassische Solaranlage",
      description: "Perfekte Integration in bestehende Dachlandschaft"
    },
    {
      url: "/lovable-uploads/05564d51-6e88-43c0-bd92-d4384f2b7668.png",
      title: "Moderne Installation",
      description: "Maximale Effizienz durch optimale Ausrichtung"
    },
    {
      url: "/lovable-uploads/29b544de-613c-42f9-aa34-0574957e516a.png",
      title: "Premium Design",
      description: "Ästhetische Integration bei Neubauten"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Unsere Referenzen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[4/3]">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">{photo.title}</h3>
                    <p className="text-sm text-gray-200">{photo.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};