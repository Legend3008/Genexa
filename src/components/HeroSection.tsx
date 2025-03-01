
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, MessageSquare, Shield } from 'lucide-react';
import * as THREE from 'three';

interface Symptom {
  name: string;
  selected: boolean;
}

interface SymptomDetails {
  temperature: string;
  headacheLocation: string;
  duration: string;
}

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userMessage, setUserMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', content: 'How can I help diagnose your health concerns today?' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // AI Diagnosis structured input state
  const [showSymptomSelector, setShowSymptomSelector] = useState(false);
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { name: 'Fever', selected: false },
    { name: 'Headache', selected: false },
    { name: 'Cough', selected: false },
    { name: 'Sore Throat', selected: false },
    { name: 'Fatigue', selected: false },
    { name: 'Nausea', selected: false },
    { name: 'Body Aches', selected: false },
  ]);
  const [symptomDetails, setSymptomDetails] = useState<SymptomDetails>({
    temperature: '',
    headacheLocation: '',
    duration: '1',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const handleSymptomToggle = (index: number) => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms[index].selected = !updatedSymptoms[index].selected;
    setSymptoms(updatedSymptoms);
  };

  const handleSymptomDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSymptomDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startStructuredDiagnosis = () => {
    setChatMessages(prev => [...prev, { 
      type: 'ai', 
      content: 'Let\'s gather some information about your symptoms. Please select all that apply:' 
    }]);
    setShowSymptomSelector(true);
    setCurrentStep(1);
  };

  const proceedToNextStep = () => {
    const selectedSymptoms = symptoms.filter(s => s.selected);
    
    if (currentStep === 1) {
      // First step - symptom selection
      if (selectedSymptoms.length === 0) {
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'Please select at least one symptom to continue.' 
        }]);
        return;
      }
      
      const symptomsList = selectedSymptoms.map(s => s.name).join(', ');
      setChatMessages(prev => [...prev, { 
        type: 'user', 
        content: `My symptoms are: ${symptomsList}` 
      }]);
      
      // Check if fever is selected
      if (selectedSymptoms.some(s => s.name === 'Fever')) {
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'What is your approximate body temperature in °F?' 
        }]);
        setCurrentStep(2);
      } 
      // Check if headache is selected
      else if (selectedSymptoms.some(s => s.name === 'Headache')) {
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'Where is your headache located?' 
        }]);
        setCurrentStep(3);
      } else {
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'How many days have you been experiencing these symptoms?' 
        }]);
        setCurrentStep(4);
      }
    } else if (currentStep === 2) {
      // Temperature input
      if (!symptomDetails.temperature) {
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'Please enter your temperature to continue.' 
        }]);
        return;
      }
      
      setChatMessages(prev => [...prev, { 
        type: 'user', 
        content: `My temperature is ${symptomDetails.temperature}°F` 
      }]);
      
      // Check if headache is also selected
      if (symptoms.some(s => s.name === 'Headache' && s.selected)) {
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'Where is your headache located?' 
        }]);
        setCurrentStep(3);
      } else {
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'How many days have you been experiencing these symptoms?' 
        }]);
        setCurrentStep(4);
      }
    } else if (currentStep === 3) {
      // Headache location
      if (!symptomDetails.headacheLocation) {
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'Please select a headache location to continue.' 
        }]);
        return;
      }
      
      setChatMessages(prev => [...prev, { 
        type: 'user', 
        content: `My headache is located in the ${symptomDetails.headacheLocation} area` 
      }]);
      
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'How many days have you been experiencing these symptoms?' 
      }]);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Duration input
      if (!symptomDetails.duration) {
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'Please enter the duration of your symptoms to continue.' 
        }]);
        return;
      }
      
      setChatMessages(prev => [...prev, { 
        type: 'user', 
        content: `I've been experiencing these symptoms for ${symptomDetails.duration} days` 
      }]);
      
      // Generate AI diagnosis
      generateDiagnosis();
    }
  };

  const generateDiagnosis = () => {
    setIsProcessing(true);
    
    // Collecting all symptoms data for the prompt
    const selectedSymptoms = symptoms.filter(s => s.selected).map(s => s.name).join(', ');
    
    // Simulate AI processing
    setTimeout(() => {
      let diagnosis = '';
      let recommendations = '';
      
      // Generate different recommendations based on selected symptoms
      if (symptoms.some(s => s.name === 'Fever' && s.selected)) {
        const feverSeverity = parseInt(symptomDetails.temperature);
        if (feverSeverity >= 103) {
          diagnosis = "You have a high fever that should be evaluated by a medical professional as soon as possible.";
          recommendations = "- Acetaminophen (Tylenol) 500mg every 6 hours as directed on the label to reduce fever\n- Ibuprofen (Advil) 400mg every 8 hours with food for pain and fever\n- Urgent: Seek medical attention immediately for fevers above 103°F";
        } else if (feverSeverity >= 100) {
          diagnosis = "You have a mild to moderate fever, possibly indicative of a viral infection.";
          recommendations = "- Acetaminophen (Tylenol) 500mg every 6 hours as directed on the label\n- Stay hydrated with plenty of fluids\n- Rest and monitor your temperature";
        } else {
          diagnosis = "Your temperature is in the normal range, but your other symptoms suggest a mild illness.";
          recommendations = "- Rest and stay hydrated\n- Monitor your symptoms for any changes";
        }
      } else if (symptoms.some(s => s.name === 'Headache' && s.selected)) {
        if (symptomDetails.headacheLocation === 'Frontal') {
          diagnosis = "Your frontal headache could be related to tension or sinus issues.";
          recommendations = "- Ibuprofen (Advil) 200-400mg every 6 hours with food\n- Apply a warm compress to your forehead\n- Consider nasal saline spray if you have congestion";
        } else if (symptomDetails.headacheLocation === 'Temporal') {
          diagnosis = "Temporal headaches may be related to tension or in some cases migraine.";
          recommendations = "- Acetaminophen (Tylenol) 500mg or Ibuprofen (Advil) 400mg as directed\n- Rest in a dark, quiet room\n- Stay hydrated and consider caffeine if this helps your headaches";
        } else {
          diagnosis = "Your headache pattern should be monitored for frequency and triggers.";
          recommendations = "- Over-the-counter pain relievers as directed on the label\n- Keep a headache journal to identify triggers\n- Ensure adequate hydration and sleep";
        }
      } else if (symptoms.some(s => s.name === 'Cough' && s.selected)) {
        diagnosis = "Your cough may be related to an upper respiratory infection or irritation.";
        recommendations = "- Dextromethorphan-based cough syrup for dry coughs\n- Honey and lemon in warm water for soothing throat irritation\n- Stay hydrated and consider a humidifier";
      } else {
        diagnosis = "Based on your described symptoms, you may be experiencing a mild seasonal illness.";
        recommendations = "- Rest and adequate hydration\n- Over-the-counter pain relievers if needed for discomfort\n- Monitor your symptoms for any changes";
      }
      
      // Add recommendation based on symptom duration
      const durationDays = parseInt(symptomDetails.duration);
      let durationAdvice = "";
      
      if (durationDays > 7) {
        durationAdvice = "\n\n⚠️ IMPORTANT: Your symptoms have persisted for more than a week. It is recommended to consult with a healthcare provider for proper evaluation.";
      } else if (durationDays > 3) {
        durationAdvice = "\n\nNote: If your symptoms don't improve in the next 2-3 days, consider consulting with a healthcare provider.";
      }
      
      // Final AI response with diagnosis and recommendations
      const aiResponse = `
**Possible Diagnosis:**
${diagnosis}

**Recommended Actions:**
${recommendations}
${durationAdvice}

**DISCLAIMER:** This is an AI-generated recommendation and should not replace professional medical advice. Consult a doctor for accurate diagnosis and treatment.
      `;
      
      setChatMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      setIsProcessing(false);
      setShowSymptomSelector(false);
      
      // Add a message about finding nearby clinics
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'Would you like to find nearby clinics or hospitals?' 
        }]);
      }, 1000);
    }, 2000);
  };

  const findNearbyClinics = () => {
    setChatMessages(prev => [...prev, { 
      type: 'user', 
      content: 'Yes, show me nearby clinics' 
    }]);
    
    setIsProcessing(true);
    
    // Request user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          setChatMessages(prev => [...prev, { 
            type: 'ai', 
            content: 'I found several medical facilities near your location. You can view them on the map below.' 
          }]);
          
          setIsProcessing(false);
          setShowMap(true);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setChatMessages(prev => [...prev, { 
            type: 'ai', 
            content: 'Sorry, I couldn\'t access your location. Please enable location services or manually search for clinics in your area.' 
          }]);
          setIsProcessing(false);
        }
      );
    } else {
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'Geolocation is not supported by your browser. Please manually search for clinics in your area.' 
      }]);
      setIsProcessing(false);
    }
  };

  const handleSubmitMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: userMessage.trim() }]);
    
    // Check for clinic request
    if (userMessage.toLowerCase().includes('clinic') || 
        userMessage.toLowerCase().includes('hospital') || 
        userMessage.toLowerCase().includes('doctor')) {
      setUserMessage('');
      findNearbyClinics();
      return;
    }
    
    // Start structured diagnosis for symptom-related queries
    if (userMessage.toLowerCase().includes('symptom') || 
        userMessage.toLowerCase().includes('sick') || 
        userMessage.toLowerCase().includes('pain') || 
        userMessage.toLowerCase().includes('fever') || 
        userMessage.toLowerCase().includes('headache') || 
        userMessage.toLowerCase().includes('cough')) {
      setUserMessage('');
      startStructuredDiagnosis();
      return;
    }
    
    // Simulate AI response for general questions
    setIsProcessing(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      // Generate AI response based on user input
      let aiResponse = '';
      const userInput = userMessage.toLowerCase();
      
      if (userInput.includes('diagnosis') || userInput.includes('check') || userInput.includes('symptoms')) {
        aiResponse = "I'd be happy to help assess your symptoms. Let's start by gathering some information about what you're experiencing.";
        startStructuredDiagnosis();
      } else if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('hey')) {
        aiResponse = "Hello! I'm the HealthSync AI Diagnosis assistant. How can I help you today? If you're experiencing any symptoms, I can help assess them.";
      } else {
        aiResponse = "I'm here to help with health-related questions and symptom assessment. If you're feeling unwell, we can start a structured symptom evaluation to provide you with better guidance.";
      }
      
      // Add AI response to chat if we haven't started structured diagnosis
      if (!aiResponse.includes("I'd be happy to help assess")) {
        setChatMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      }
      
      setIsProcessing(false);
      setUserMessage('');
    }, 1000);
  };

  useEffect(() => {
    // Only load Three.js on client-side
    let scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, 
        renderer: THREE.WebGLRenderer,
        sphere: THREE.Mesh,
        animationFrameId: number;

    const init = async () => {
      if (!canvasRef.current || !containerRef.current) return;

      try {
        // Dynamic import of Three.js for client-side rendering
        const THREE = await import('three');
        
        // Initialize scene
        scene = new THREE.Scene();

        // Set up camera
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        // Initialize renderer
        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Create sphere geometry
        const geometry = new THREE.SphereGeometry(2, 64, 64);
        
        // Create material with custom shader
        const material = new THREE.MeshStandardMaterial({
          color: 0x0096e7,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        });

        // Create mesh
        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Handle window resize
        const handleResize = () => {
          if (!containerRef.current) return;
          
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = () => {
          sphere.rotation.x += 0.001;
          sphere.rotation.y += 0.002;
          
          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Clean up
        return () => {
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationFrameId);
          
          // Dispose resources
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        };
      } catch (error) {
        console.error('Error initializing 3D scene:', error);
      }
    };

    init();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Load the Google Maps script 
  useEffect(() => {
    if (showMap && userLocation && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else if (showMap && userLocation && window.google) {
      initMap();
    }
  }, [showMap, userLocation]);

  // Initialize the map
  const initMap = () => {
    if (!userLocation || !window.google) return;

    const mapDiv = document.getElementById('nearbyMap');
    if (!mapDiv) return;

    const map = new google.maps.Map(mapDiv, {
      center: userLocation,
      zoom: 13
    });

    // Add a marker for the user's location
    new google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 8
      }
    });

    // Search for nearby medical facilities
    const request = {
      location: userLocation,
      radius: 5000, // 5km radius
      types: ['hospital', 'doctor', 'health']
    };

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i], map);
        }
      }
    });
  };

  // Create a marker for each place
  const createMarker = (place, map) => {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name
    });

    const infowindow = new google.maps.InfoWindow({
      content: `
        <div>
          <h3 style="font-weight:bold;margin-bottom:5px;">${place.name}</h3>
          <p>${place.vicinity}</p>
          ${place.rating ? `<p>Rating: ${place.rating} ⭐</p>` : ''}
          <a href="https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank" style="color:blue;text-decoration:underline;">Get Directions</a>
        </div>
      `
    });

    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });
  };

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center pt-20 bg-gradient-to-b from-blue-50 to-teal-50">
      {/* Background 3D Sphere */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 -z-10 opacity-70"
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="stagger-animation">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-blue-600 font-medium text-sm mb-6 border border-blue-100">
              Next-Gen Healthcare Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Advanced Medical <span className="text-blue-500">Technology</span> For Better Care
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Experience the future of healthcare with AI diagnostics, blockchain records, and real-time facility mapping—all in one secure platform.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/appointments" className="btn-primary">
                <Calendar size={18} className="mr-2" />
                Book Appointment
              </Link>
              <Link to="/mission" className="btn-secondary">
                Learn More <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">HIPAA Compliant</h3>
                  <p className="text-sm text-gray-600">Secure and protected data</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">24/7 Support</h3>
                  <p className="text-sm text-gray-600">Always here to help</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Easy Scheduling</h3>
                  <p className="text-sm text-gray-600">Book appointments online</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:ml-auto animate-float">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-teal-200 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative glass-card p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">AI Diagnosis</h3>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Online</span>
                </div>
                
                <div className="space-y-4 mb-6 max-h-[240px] overflow-y-auto">
                  {chatMessages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`${
                        message.type === 'ai' 
                          ? 'bg-blue-50 rounded-lg p-3 max-w-[80%]' 
                          : 'bg-white rounded-lg p-3 ml-auto max-w-[80%] shadow-sm'
                      }`}
                    >
                      {message.type === 'ai' && message.content.includes('**') ? (
                        <div className="prose prose-sm">
                          {message.content.split('\n').map((line, i) => {
                            if (line.startsWith('**')) {
                              return <p key={i} className="font-bold text-blue-700">{line.replace(/\*\*/g, '')}</p>;
                            } else if (line.startsWith('- ')) {
                              return <p key={i} className="flex"><span className="mr-2">•</span>{line.substring(2)}</p>;
                            } else if (line.startsWith('⚠️')) {
                              return <p key={i} className="text-red-600 font-medium">{line}</p>;
                            } else {
                              return <p key={i}>{line}</p>;
                            }
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-700">{message.content}</p>
                      )}
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="bg-blue-50 rounded-lg p-3 max-w-[80%]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {showSymptomSelector ? (
                  <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {currentStep === 1 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Select your symptoms:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {symptoms.map((symptom, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`symptom-${index}`}
                                checked={symptom.selected}
                                onChange={() => handleSymptomToggle(index)}
                                className="mr-2"
                              />
                              <label htmlFor={`symptom-${index}`}>{symptom.name}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 2 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Temperature (°F):</h4>
                        <input
                          type="number"
                          name="temperature"
                          value={symptomDetails.temperature}
                          onChange={handleSymptomDetailsChange}
                          placeholder="e.g., 100.5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}
                    
                    {currentStep === 3 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Headache Location:</h4>
                        <select
                          name="headacheLocation"
                          value={symptomDetails.headacheLocation}
                          onChange={handleSymptomDetailsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">Select location</option>
                          <option value="Frontal">Frontal (Forehead)</option>
                          <option value="Temporal">Temporal (Sides)</option>
                          <option value="Occipital">Occipital (Back of head)</option>
                          <option value="All over">All over</option>
                        </select>
                      </div>
                    )}
                    
                    {currentStep === 4 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Duration (days):</h4>
                        <input
                          type="number"
                          name="duration"
                          value={symptomDetails.duration}
                          onChange={handleSymptomDetailsChange}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}
                    
                    <button
                      onClick={proceedToNextStep}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                ) : showMap ? (
                  <div>
                    <div id="nearbyMap" className="h-[200px] mb-4 rounded-lg overflow-hidden border border-gray-200"></div>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Click on a marker to see details and get directions.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitMessage} className="relative">
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      placeholder="Describe your symptoms in detail..."
                      value={userMessage}
                      onChange={handleUserInput}
                      disabled={isProcessing}
                    />
                    <button 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      type="submit"
                      disabled={isProcessing || !userMessage.trim()}
                    >
                      <ArrowRight size={18} />
                    </button>
                  </form>
                )}
                
                {chatMessages.length > 1 && 
                 chatMessages[chatMessages.length - 1].type === 'ai' && 
                 chatMessages[chatMessages.length - 1].content.includes('Would you like to find nearby clinics') && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={findNearbyClinics}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <MapPin size={16} className="mr-2" />
                      Find Nearby Clinics
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
