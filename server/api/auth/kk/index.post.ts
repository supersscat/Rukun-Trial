import { KK } from '~/server/model/KK';
import { LogRequest } from '~/types/AuthType';
import { ActionLog } from '~/types/TypesModel';

export default defineEventHandler(async (event) => {
    // Check if user exists
    const user = event.context.auth.user;

    if (!user) {
        console.log('Pengguna tidak valid.');
        setResponseStatus(event, 403);
        return { code: 403, message: 'Pengguna tidak valid' };
    }

    try {
        // Read the request body
        const data = await readBody(event);

        // Assign user ID from the token for create_by field
        const newData = {
            ...data,
            create_by: user.id
        }

        const kk = await KK.createKK(newData);

        const payload: LogRequest = {
            user_id: user.id,
            action: ActionLog.CREATE,
            description: `Data KK dengan ID ${kk.id}, berhasil ditambahkan`,
        };

        await createLog(payload);

        return {
            code: 201,
            message: 'Data KK berhasil ditambahkan!',
            data: kk,
        };
    } catch (error: any) {
        console.error('Kesalahan terjadi:', error);
        return sendError(event, createError({ statusCode: 500, statusMessage: 'Internal Server Error' }));
    }
});
