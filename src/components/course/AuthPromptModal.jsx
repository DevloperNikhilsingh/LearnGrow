import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

export default function AuthPromptModal({ isOpen, onClose, returnTo, message }) {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="p-6 text-center">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={26} className="text-primary" />
        </div>
        <h3 className="text-lg font-bold text-[#1F1F1F] mb-2">Create an account first</h3>
        <p className="text-sm text-muted mb-6">{message || 'You need an account to continue. It only takes a minute.'}</p>
        <div className="flex flex-col gap-2.5">
          <Button
            variant="primary"
            className="w-full py-3"
            aria-label="Create-Account"
            onClick={() => navigate('/signup', { state: { returnTo } })}
          >
            Create Account
          </Button>
          <Button
            variant="outline"
            className="w-full py-3"
            aria-label='login'
            onClick={() => navigate('/login', { state: { returnTo } })}
          >
            I already have an account
          </Button>
          <button
            onClick={onClose}
            aria-label='cancel'
            className="text-sm text-muted hover:text-[#1F1F1F] mt-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}