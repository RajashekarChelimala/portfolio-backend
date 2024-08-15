import Service from '../models/Service.js';

// Handle new service creation
export const handleNewService = async (req, res) => {
  const { serviceName, iconName, targetUrl, displayOrder, isActive } = req.body;
  const newService = new Service({ serviceName, iconName, targetUrl, displayOrder, isActive });
  try {
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({displayOrder: 'asc'});
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get Active Services
export const getAllActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({displayOrder: 'asc'});
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific service by ID
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a specific service by ID
export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a specific service by ID
export const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.body.id, req.body, { new: true });
    if (!updatedService) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
