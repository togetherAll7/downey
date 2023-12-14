import { useClient } from '../../../../lib/useClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const urlSlug = data?.urlParameter;
  const name = `${data.PEOPLE.P_A_FNAME} + ${data.PEOPLE.P_B_FNAME}`;
  const email = data.PEOPLE.P_A_EMAIL || data.PEOPLE.P_B_EMAIL;
  const phone = data.PEOPLE.P_A_PHONE || data.PEOPLE.P_B_PHONE;
  const archived = data.ADMIN_INFO.ARCHIVED;
  const supabase = useClient();
  const isDev = process.env.NODE_ENV === 'development';

  if (!urlSlug) {
    const { data: res, error: inviteError } =
      await supabase.auth.admin.inviteUserByEmail(
        data.PEOPLE.P_A_EMAIL || data.PEOPLE.P_B_EMAIL,
        {
          data: { role: 'client' },
          redirectTo: isDev
            ? `http://localhost:3000/auth/callback?next=/update-password`
            : `https://planning.downeystreetevents.com/auth/callback?next=/update-password`,
        }
      );

    const { error } = await supabase.from('new_client').insert([
      {
        ...data,
      },
    ]);

    await supabase.from('users').insert([
      {
        name: name,
        email: email,
        phone: phone,
        address: `${data.PEOPLE.P_A_ADD1} ${data.PEOPLE.P_A_ADD2} ${data.PEOPLE.P_A_CITY} ${data.PEOPLE.P_A_STATE} ${data.PEOPLE.P_A_ZIP}`,
        archived: archived,
        role: 'client',
      },
    ]);

    if (error) return NextResponse.json({ error: 'Client already exists.' });
  } else {
    const { error } = await supabase
      .from('new_client')
      .update([
        {
          ...data,
          urlParameter: undefined,
        },
      ])
      .eq('SLUG', urlSlug);

    await supabase
      .from('users')
      .update([
        {
          name: name,
          email: email,
          phone: phone,
          address: `${data.PEOPLE.P_A_ADD1} ${data.PEOPLE.P_A_ADD2} ${data.PEOPLE.P_A_CITY} ${data.PEOPLE.P_A_STATE} ${data.PEOPLE.P_A_ZIP}`,
          archived: archived,
          role: 'client',
        },
      ])
      .eq('email', email);
    if (error) return NextResponse.json({ error: error.message });
  }

  return NextResponse.json({ data });
}
