local bit = require("bit")
local ffi = require("ffi")

function hexToFloat(str, little_endian)
  local tab={["0"]="0000",["1"]="0001",["2"]="0010",["3"]="0011",
    ["4"]="0100",["5"]="0101",["6"]="0110",["7"]="0111",
    ["8"]="1000",["9"]="1001",["a"]="1010",["b"]="1011",
    ["c"]="1100",["d"]="1101",["e"]="1110",["f"]="1111",
    ["A"]="1010",["B"]="1011",["C"]="1100",["D"]="1101",["E"]="1110",["F"]="1111"}

  if little_endian ~= nil and little_endian == true then -- big endian or little endian (reversed array)
    str = string.sub(str,7,8)..string.sub(str,5,6)..string.sub(str,3,4)..string.sub(str,1,2) 
  end

  local str1=""
  local a,z
  for z=1,string.len(str) do
    a=string.sub(str,z,z)
    str1=str1..tab[a]
  end
  local pm=string.sub(str1,1,1)
  local exp=string.sub(str1,2,9)
  local c=tonumber(exp,2)-127
  local p=math.pow(2,c)
  local man="1"..string.sub(str1,10,32)
  local x=0
  for z=1,string.len(man) do
    if string.sub(man,z,z)=="1" then
      x=x+p
    end
    p=p/2
  end
  if pm=="1" then
    x= -x
  end    
  return(x)
end


local function tenToSixteen(src)
  local res = 0
  local multiple = 0
  local num = math.abs(src)
  while num > 0 do
    local decimal = num%16
    num = math.floor(num/16)
    res = res + decimal * math.pow(10,multiple)
    multiple = multiple + 1
  end
  print(res)
end


-- local seRead = {}
-- function seRead.write(id,value)

--  local cjson = require("cjson")
local res_file = "E:/result.txt"
local filePath = "E:/basin_realtime_2017082857600.bin"
local file = io.open(filePath, "r+b")
local res_f = io.open(res_file,"w+b")
if not file then
  return nil, "打开文件失败！"
end
local fileLength = file:seek("end")

file:seek("set", 80)
local v1 = file:read(16)
print("abc:"..v1)
local v2 = file:read(4)
--  print("FLOAT:"..v2)
--print("len:"..v2:len())
local buf = ffi.new("uint8_t[?]", 4)
ffi.copy(buf, v2)

local hexStr = ""
for i=0,3 do
  local num = buf[i]
--  print(num)
  hexStr = hexStr..string.format("%x", num)
end
local floatValue = ""
if hexStr == "0000" then 
  floatValue = 0
else
  floatValue = hexToFloat(hexStr,true)
end
print("value:"..floatValue)



--res_f:write(v)
--local a = string.format("%f",v)
--f:close()
--local writeStatus = file:write(value)
--if not writeStatus then
--  return nil, "写入失败！"
--end
--file:close()
--return "OK",nil
--end
--return seRead