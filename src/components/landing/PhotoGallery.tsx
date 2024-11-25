import { motion } from "framer-motion";

export const PhotoGallery = () => {
  const photos = [
    {
      url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d",
      title: "Moderne Solaranlage",
      description: "Hocheffiziente Solarmodule für maximale Leistung"
    },
    {
      url: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
      title: "Nachhaltige Energie",
      description: "Umweltfreundliche Stromerzeugung für Ihr Zuhause"
    },
    {
      url: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d",
      title: "Professionelle Installation",
      description: "Fachmännische Montage durch unsere Experten"
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
              <div className="relative overflow-hidden rounded-xl shadow-lg aspect-video">
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