export const UI_TEXTS = {
  PT: {
    COMMON: {
      APP_NAME: import.meta.env.VITE_APP_NAME || "FlowPayment",
      BACK_BUTTON: "Voltar",
    },
    SIDEBAR: {
      DASHBOARD: "Dashboard",
      PROFILE: "Meu Perfil",
      SETTINGS: "Configurações",
    },
    DASHBOARD: {
      TITLE: "Dashboard",
      GREETING: "Olá, Bem-vindo de volta!",
      AVATAR_TOOLTIP: "Ver Perfil",
      STATS: {
        BALANCE: "Saldo Disponível",
        LEDGER: "Status do Ledger",
        LATENCY: "Latência API",
        ACTIVE: "Ativo"
      },
      QUICK_TRANSFER: {
        TITLE: "Transferência Rápida",
        DESTINATION: "E-mail do destinatário",
        VALUE: "Valor (R$)",
        BUTTON: "Confirmar Envio",
        PLACEHOLDER_EMAIL: "exemplo@email.com",
      },
      HISTORY: {
        TITLE: "Atividade Recente",
        EMPTY: "Nenhuma transação processada hoje.",
        LOG_KAFKA: "Monitorando logs via Kafka..."
      },
      ACTIONS: {
        DEPOSIT: "Adicionar Crédito",
        TRANSFER: "Nova Transferência"
      }
    },
    PROFILE: {
        TITLE: "Editar Perfil",
        DESCRIPTION: "Gerencie suas informações pessoais e dados de contato para o sistema financeiro.",
        SECTIONS: {
            BASIC_INFO: "Informações Básicas",
            ADDRESS: "Endereço"
        },
        FIELDS: {
            FIRST_NAME: "Nome",
            LAST_NAME: "Sobrenome",
            EMAIL: "E-mail",
            PHONE: "Telefone",
            DOC_TYPE: "Tipo Doc",
            DOC_NUMBER: "Número",
            BIRTH_DATE: "Nascimento",
            ZIP_CODE: "CEP",
            STREET: "Rua/Logradouro",
            CITY: "Cidade",
            STATE: "Estado"
        },
        SAVE_BTN: "Salvar Alterações",
        SUCCESS_MSG: "Perfil atualizado localmente!"
    },
    DEPOSIT: {
        TITLE: "Adicionar Saldo",
        SUBTITLE: "Informe o valor que deseja creditar em sua conta via Ledger.",
        LABEL_VALUE: "Valor do Depósito",
        PLACEHOLDER_VALUE: "0,00",
        CONFIRM_BTN: "Confirmar Depósito",
        SUCCESS_MSG: "Crédito realizado com sucesso!",
        INFO_TITLE: "Atenção",
        INFO_ITEMS: [
            "O saldo será processado via mensageria Kafka.",
            "O valor ficará disponível para transferências imediatas.",
            "Esta é uma operação simulada de ambiente de teste."
        ]
    },
    SETTINGS: {
      TITLE: "Configurações",
      DESCRIPTION: "Gerencie as integrações e comunicações do sistema.",
    }
  },
  EN: {
    COMMON: {
      APP_NAME: import.meta.env.VITE_APP_NAME || "FlowPayment",
      BACK_BUTTON: "Back",
    },
    SIDEBAR: {
      DASHBOARD: "Dashboard",
      PROFILE: "My Profile",
      SETTINGS: "Settings",
    },
    DASHBOARD: {
      TITLE: "Dashboard",
      GREETING: "Hello, Welcome back!",
      AVATAR_TOOLTIP: "View Profile",
      STATS: {
        BALANCE: "Available Balance",
        LEDGER: "Ledger Status",
        LATENCY: "API Latency",
        ACTIVE: "Active"
      },
      QUICK_TRANSFER: {
        TITLE: "Quick Transfer",
        DESTINATION: "Recipient's Email",
        VALUE: "Amount ($)",
        BUTTON: "Confirm Sending",
        PLACEHOLDER_EMAIL: "example@email.com",
      },
      HISTORY: {
        TITLE: "Recent Activity",
        EMPTY: "No transactions processed today.",
        LOG_KAFKA: "Monitoring logs via Kafka..."
      },
      ACTIONS: {
        DEPOSIT: "Add Credit",
        TRANSFER: "New Transfer"
      }
    },
    PROFILE: {
        TITLE: "Edit Profile",
        DESCRIPTION: "Manage your personal information and contact details for the financial system.",
        SECTIONS: {
            BASIC_INFO: "Basic Information",
            ADDRESS: "Address"
        },
        FIELDS: {
            FIRST_NAME: "First Name",
            LAST_NAME: "Last Name",
            EMAIL: "Email",
            PHONE: "Phone Number",
            DOC_TYPE: "Doc Type",
            DOC_NUMBER: "Number",
            BIRTH_DATE: "Birth Date",
            ZIP_CODE: "Zip Code",
            STREET: "Street/Address",
            CITY: "City",
            STATE: "State"
        },
        SAVE_BTN: "Save Changes",
        SUCCESS_MSG: "Profile updated locally!"
    },
    DEPOSIT: {
        TITLE: "Add Balance",
        SUBTITLE: "Enter the amount you wish to credit to your account via Ledger.",
        LABEL_VALUE: "Deposit Amount",
        PLACEHOLDER_VALUE: "0.00",
        CONFIRM_BTN: "Confirm Deposit",
        SUCCESS_MSG: "Credit completed successfully!",
        INFO_TITLE: "Attention",
        INFO_ITEMS: [
            "The balance will be processed via Kafka messaging.",
            "The amount will be available for immediate transfers.",
            "This is a simulated operation in a test environment."
        ]
    },
    SETTINGS: {
      TITLE: "Settings",
      DESCRIPTION: "Manage system integrations and communications.",
    }
  }
} as const;