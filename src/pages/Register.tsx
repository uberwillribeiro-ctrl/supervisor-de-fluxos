import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoMark } from '@/components/ui/LogoMark';
import { useAuth } from '@/hooks/useAuth';

// ─── Validação ───────────────────────────────────────────────────────────────

interface FormFields {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim()) {
    errors.name = 'Nome é obrigatório';
  } else if (fields.name.trim().length < 3) {
    errors.name = 'Mínimo de 3 caracteres';
  }

  if (!fields.email.trim()) {
    errors.email = 'E-mail é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'E-mail inválido';
  }

  if (!fields.password) {
    errors.password = 'Senha é obrigatória';
  } else if (fields.password.length < 6) {
    errors.password = 'Mínimo de 6 caracteres';
  }

  if (!fields.confirm) {
    errors.confirm = 'Confirmação é obrigatória';
  } else if (fields.confirm !== fields.password) {
    errors.confirm = 'As senhas não coincidem';
  }

  return errors;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [fields, setFields] = useState<FormFields>({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormFields, boolean>>({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });

  function handleChange(field: keyof FormFields) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const updated = { ...fields, [field]: e.target.value };
      setFields(updated);
      if (touched[field]) {
        setErrors(validate(updated));
      }
    };
  }

  function handleBlur(field: keyof FormFields) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(fields));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await register(fields.name, fields.email, fields.password);
      navigate('/onboarding');
    } catch {
      setErrors({ email: 'Não foi possível criar a conta. Tente novamente.' });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <LogoMark size="md" />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-slate-100">Crie sua conta</h1>
            <p className="text-sm text-slate-500 mt-0.5">Comece a organizar seus fluxos hoje</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 ring-1 ring-slate-800 rounded-2xl p-7 shadow-2xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Maria da Silva"
              autoComplete="name"
              value={fields.name}
              onChange={handleChange('name')}
              onBlur={() => handleBlur('name')}
              error={touched.name ? errors.name : undefined}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="voce@exemplo.com"
              autoComplete="email"
              value={fields.email}
              onChange={handleChange('email')}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : undefined}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={fields.password}
              onChange={handleChange('password')}
              onBlur={() => handleBlur('password')}
              error={touched.password ? errors.password : undefined}
              hint="Mínimo de 6 caracteres"
            />

            <Input
              label="Confirmar senha"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={fields.confirm}
              onChange={handleChange('confirm')}
              onBlur={() => handleBlur('confirm')}
              error={touched.confirm ? errors.confirm : undefined}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full mt-2"
            >
              {!isLoading && <UserPlus className="size-4" />}
              Criar conta
            </Button>
          </form>
        </div>

        {/* Rodapé */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
