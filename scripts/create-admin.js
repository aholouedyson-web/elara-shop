const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    if (k && v) env[k] = v;
  }
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const email = 'admin@elara.es';
  const password = 'admin1234';

  console.log('--- Configuration Admin Supabase ---');
  let userId = null;

  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: 'Admin', last_name: 'Élara' }
  });

  if (error) {
    console.log('Note création auth:', error.message);
    const { data: list } = await supabase.auth.admin.listUsers();
    const found = list?.users?.find(u => u.email === email);
    if (found) {
      userId = found.id;
      await supabase.auth.admin.updateUserById(userId, { password, email_confirm: true });
      console.log('Mot de passe mis à jour pour le compte existant.');
    }
  } else if (user?.user) {
    userId = user.user.id;
    console.log('Nouvel utilisateur Auth créé, ID:', userId);
  }

  if (userId) {
    const { error: pErr } = await supabase.from('profiles').upsert({
      id: userId,
      first_name: 'Admin',
      last_name: 'Élara',
      email: email,
      role: 'super_admin'
    });
    if (pErr) {
      console.error('Erreur table profiles:', pErr.message);
    } else {
      console.log('>>> SUCCES: Compte admin@elara.es cree avec le role super_admin ! <<<');
    }
  }
}

main().catch(err => console.error('Exception:', err));
