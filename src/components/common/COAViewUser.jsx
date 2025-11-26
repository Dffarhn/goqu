import React, { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, ChevronRight } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";

const COAViewUser = ({ coaList, saldoAkun = {} }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipe, setFilterTipe] = useState("ALL");
  const [expandedGroups, setExpandedGroups] = useState({});

  // Helper function untuk sorting kode akun hierarchical
  const compareKodeAkun = (a, b) => {
    const aParts = a.split(".").map(Number);
    const bParts = b.split(".").map(Number);
    const maxLength = Math.max(aParts.length, bParts.length);

    for (let i = 0; i < maxLength; i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      if (aPart !== bPart) {
        return aPart - bPart;
      }
    }
    return 0;
  };

  // Build hierarchical structure
  const buildTree = (accounts) => {
    const accountMap = {};
    const rootAccounts = [];

    // Create map of all accounts
    accounts.forEach((acc) => {
      accountMap[acc.id] = { ...acc, children: [] };
    });

    // Build tree structure
    accounts.forEach((acc) => {
      if (acc.parentId && accountMap[acc.parentId]) {
        accountMap[acc.parentId].children.push(accountMap[acc.id]);
      } else {
        rootAccounts.push(accountMap[acc.id]);
      }
    });

    // Sort each level
    const sortTree = (nodes) => {
      nodes.sort((a, b) => compareKodeAkun(a.kodeAkun, b.kodeAkun));
      nodes.forEach((node) => {
        if (node.children.length > 0) {
          sortTree(node.children);
        }
      });
    };

    sortTree(rootAccounts);
    return rootAccounts;
  };

  // Filter accounts
  const filteredCOA = useMemo(() => {
    let filtered = coaList.filter((coa) => {
      const matchSearch =
        coa.kodeAkun.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coa.namaAkun.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coa.kategori?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipe = filterTipe === "ALL" || coa.tipeAkun === filterTipe;

      return matchSearch && matchTipe;
    });

    return filtered;
  }, [coaList, searchTerm, filterTipe]);

  const treeData = useMemo(() => {
    return buildTree(filteredCOA);
  }, [filteredCOA]);

  const toggleGroup = (accountId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const getTipeColor = (tipe) => {
    const colors = {
      ASET: "bg-blue-100 text-blue-800",
      KEWAJIBAN: "bg-red-100 text-red-800",
      EKUITAS: "bg-green-100 text-green-800",
      PENDAPATAN: "bg-emerald-100 text-emerald-800",
      BEBAN: "bg-orange-100 text-orange-800",
    };
    return colors[tipe] || "bg-gray-100 text-gray-800";
  };

  const getSaldo = (accountId) => {
    const saldo = saldoAkun[accountId];
    if (saldo === undefined || saldo === null) return 0;
    return typeof saldo === "number" ? saldo : parseFloat(saldo) || 0;
  };

  // Render account row (recursive)
  const renderAccountRow = (account, level = 0) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedGroups[account.id];
    const saldo = getSaldo(account.id);
    const indent = level * 24;

    return (
      <React.Fragment key={account.id}>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-4 py-3 whitespace-nowrap">
            <div style={{ paddingLeft: `${indent}px` }} className="flex items-center gap-2">
              {hasChildren && (
                <button
                  onClick={() => toggleGroup(account.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}
              {!hasChildren && <span className="w-4" />}
              <span className="text-sm font-mono font-medium text-gray-900">
                {account.kodeAkun}
              </span>
            </div>
          </td>
          <td className="px-4 py-3">
            <span className="text-sm text-gray-900 font-medium">{account.namaAkun}</span>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <span
              className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getTipeColor(
                account.tipeAkun
              )}`}
            >
              {account.tipeAkun}
            </span>
          </td>
          <td className="px-4 py-3">
            <span className="text-sm text-gray-700">{account.kategori || "-"}</span>
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-right">
            <span
              className={`text-sm font-medium ${
                saldo >= 0 ? "text-gray-900" : "text-red-600"
              }`}
            >
              {formatCurrency(saldo)}
            </span>
          </td>
        </tr>
        {hasChildren && isExpanded && account.children.map((child) => renderAccountRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header dengan Search dan Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari akun..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterTipe}
                onChange={(e) => setFilterTipe(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white text-gray-900"
              >
                <option value="ALL">Semua Tipe</option>
                <option value="ASET">Aset</option>
                <option value="KEWAJIBAN">Kewajiban</option>
                <option value="EKUITAS">Ekuitas</option>
                <option value="PENDAPATAN">Pendapatan</option>
                <option value="BEBAN">Beban</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode Akun
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Akun
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saldo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {treeData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada data akun
                </td>
              </tr>
            ) : (
              treeData.map((account) => renderAccountRow(account, 0))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default COAViewUser;

