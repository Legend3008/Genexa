
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MessageSquare, Shield } from 'lucide-react';
import * as THREE from 'three';

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userMessage, setUserMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', content: 'How can I help diagnose your health concerns today?' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const handleSubmitMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: userMessage.trim() }]);
    
    // Simulate AI processing
    setIsProcessing(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      // Generate AI response based on user input
      let aiResponse = '';
      const userInput = userMessage.toLowerCase();
      
      if (userInput.includes('headache') || userInput.includes('head') || userInput.includes('pain')) {
        aiResponse = "I understand you're experiencing headaches. How long have you been having them, and do you notice any triggers? This could be related to stress, dehydration, or other factors.";
      } else if (userInput.includes('fever') || userInput.includes('temperature')) {
        aiResponse = "A fever can be a sign that your body is fighting an infection. Are you experiencing any other symptoms like chills, fatigue, or body aches?";
      } else if (userInput.includes('cough') || userInput.includes('cold') || userInput.includes('flu')) {
        aiResponse = "Could you describe your cough? Is it dry or productive? Also, have you been experiencing any other respiratory symptoms or fever?";
      } else if (userInput.includes('stomach') || userInput.includes('nausea') || userInput.includes('vomit')) {
        aiResponse = "Stomach issues can be caused by various factors. Have you eaten anything unusual lately? How long have you been experiencing these symptoms?";
      } else {
        aiResponse = "I'd like to understand more about your symptoms. Could you provide additional details so I can better assist you?";
      }
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      setIsProcessing(false);
      setUserMessage('');
    }, 1500);
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
                      <p className="text-gray-700">{message.content}</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
