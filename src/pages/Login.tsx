import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoMark } from '@/components/ui/LogoMark';
import { useAuth } from '@/hooks/useAuth';

// ─── Validação ───────────────────────────────────────────────────────────────

interface FormFields {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

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

  return errors;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [fields, setFields] = useState<FormFields>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormFields, boolean>>({
    email: false,
    password: false,
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
    const nextTouched = { ...touched, [field]: true };
    setTouched(nextTouched);
    setErrors(validate(fields));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await login(fields.email, fields.password);
      navigate('/app');
    } catch {
      setErrors({ password: 'Não foi possível entrar. Tente novamente.' });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <LogoMark size="md" />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-slate-100">Supervisor de Fluxos</h1>
            <p className="text-sm text-slate-500 mt-0.5">Entre na sua conta para continuar</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 ring-1 ring-slate-800 rounded-2xl p-7 shadow-2xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

            <div className="space-y-1.5">
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={fields.password}
                onChange={handleChange('password')}
                onBlur={() => handleBlur('password')}
                error={touched.password ? errors.password : undefined}
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full mt-2"
            >
              {!isLoading && <ArrowRight className="size-4" />}
              Entrar
            </Button>
          </form>
        </div>

        {/* Rodapé */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
