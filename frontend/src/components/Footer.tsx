import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-scandinavian-bg mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-scandinavian-dark mb-3">About</h3>
            <p className="text-sm text-scandinavian-text-secondary">
              Scanner Bridge is a local solution for connecting physical document scanners to web browsers.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold text-scandinavian-dark mb-3">Features</h3>
            <ul className="text-sm text-scandinavian-text-secondary space-y-2">
              <li>• Local-first architecture</li>
              <li>• Multi-platform support</li>
              <li>• Real-time updates</li>
              <li>• Image optimization</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-scandinavian-dark mb-3">Resources</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="text-scandinavian-accent-blue hover:text-scandinavian-accent-pink">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-scandinavian-accent-blue hover:text-scandinavian-accent-pink">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-scandinavian-accent-blue hover:text-scandinavian-accent-pink">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-scandinavian-bg pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-scandinavian-text-tertiary">
            <p>&copy; 2026 Sudanese Scanner Bridge. All rights reserved.</p>
            <p>Built for the Sudanese Programming Challenge</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
