import { RegisterRequestState } from "@/generated/prisma";
import { prisma } from ".";

export const registerRequest = {
  async NewRequest(data: {
    email: string;
    password: string;
    name: string;
    reason: string;
  }) {
    return await prisma.publicRegistrationRequest.create({
      data,
    });
  },

  async FindRegisterRequest(id: string) {
    return await prisma.publicRegistrationRequest.findFirst({
      where: { id },
    });
  }, 

  async GetAllRegisterRequests() {
    return await prisma.publicRegistrationRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async ChangeRegisterRequestState(id: string, state: RegisterRequestState) {
    return await prisma.publicRegistrationRequest.update({
      where: { id },
      data: { state },
    });
  },
};
