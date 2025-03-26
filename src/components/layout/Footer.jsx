export default function Footer() {
  return (
    <footer className="bg-bg-secondary py-6 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Sahyatri</h3>
            <p className="text-text-secondary">Your train station navigation companion</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-text-secondary hover:text-accent-primary">
              Terms
            </a>
            <a href="#" className="text-text-secondary hover:text-accent-primary">
              Privacy
            </a>
            <a href="#" className="text-text-secondary hover:text-accent-primary">
              Help
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-text-secondary text-sm">
          &copy; {new Date().getFullYear()} Sahyatri. All rights reserved.
        </div>
      </div>
    </footer>
  );
}